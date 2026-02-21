"""
TTS Service — Edge-TTS voice synthesis.

Uses Microsoft Edge TTS (free, no API key) to generate natural Vietnamese
speech. Saves as MP3 to /app/media/tts/.
"""
from __future__ import annotations

import asyncio
import logging
import os
from uuid import uuid4

logger = logging.getLogger(__name__)

TTS_DIR = "/app/media/tts"
BACKEND_BASE_URL = os.getenv("BACKEND_EXTERNAL_URL", "http://localhost:8000")

# Available Vietnamese voices
VOICES = {
    "female": "vi-VN-HoaiMyNeural",
    "male": "vi-VN-NamMinhNeural",
}


class TTSService:
    """Text-to-Speech using Microsoft Edge TTS."""

    async def synthesize(
        self,
        text: str,
        voice: str = "vi-VN-HoaiMyNeural",
        output_format: str = "mp3",
    ) -> dict:
        """
        Convert text to speech.
        Returns: {"audio_path": "/app/media/tts/...", "audio_url": "http://.../media/tts/..."}
        """
        import edge_tts

        os.makedirs(TTS_DIR, exist_ok=True)
        audio_id = str(uuid4())[:8]
        filename = f"voice_{audio_id}.{output_format}"
        filepath = os.path.join(TTS_DIR, filename)

        # Clean text for TTS (remove markdown formatting)
        clean_text = self._clean_for_tts(text)
        if not clean_text.strip():
            return {"audio_path": None, "audio_url": None, "filename": None}

        # Limit text length to avoid very long audio
        if len(clean_text) > 3000:
            clean_text = clean_text[:3000] + "... Nội dung còn lại xin xem chi tiết trong văn bản."

        try:
            communicate = edge_tts.Communicate(clean_text, voice)
            await communicate.save(filepath)

            audio_url = f"{BACKEND_BASE_URL}/media/tts/{filename}"
            logger.info(f"[tts] Audio saved: {filepath} ({len(clean_text)} chars)")

            return {
                "audio_path": filepath,
                "audio_url": audio_url,
                "filename": filename,
            }
        except Exception as e:
            logger.exception(f"[tts] Synthesis failed: {e}")
            return {"audio_path": None, "audio_url": None, "filename": None}

    def synthesize_sync(
        self,
        text: str,
        voice: str = "vi-VN-HoaiMyNeural",
        output_format: str = "mp3",
    ) -> dict:
        """Synchronous wrapper for use in Celery tasks."""
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                import concurrent.futures
                with concurrent.futures.ThreadPoolExecutor() as pool:
                    return pool.submit(
                        asyncio.run,
                        self.synthesize(text, voice, output_format),
                    ).result()
            return loop.run_until_complete(
                self.synthesize(text, voice, output_format)
            )
        except RuntimeError:
            return asyncio.run(self.synthesize(text, voice, output_format))

    @staticmethod
    def _clean_for_tts(text: str) -> str:
        """Remove markdown formatting for natural TTS reading."""
        import re
        # Remove markdown bold/italic
        text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
        text = re.sub(r"\*(.+?)\*", r"\1", text)
        # Remove markdown links [text](url)
        text = re.sub(r"\[(.+?)\]\(.+?\)", r"\1", text)
        # Remove code blocks
        text = re.sub(r"```[\s\S]*?```", "", text)
        text = re.sub(r"`(.+?)`", r"\1", text)
        # Remove headers
        text = re.sub(r"^#{1,6}\s+", "", text, flags=re.MULTILINE)
        # Remove horizontal rules
        text = re.sub(r"^---+$", "", text, flags=re.MULTILINE)
        # Remove citation blocks
        text = re.sub(r"📄.*$", "", text, flags=re.MULTILINE)
        # Clean up excess whitespace
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip()


# Module-level singleton
_service: TTSService | None = None


def get_tts_service() -> TTSService:
    global _service
    if _service is None:
        _service = TTSService()
    return _service
