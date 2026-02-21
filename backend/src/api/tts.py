"""
TTS API — Text-to-Speech endpoint using Edge-TTS.
Returns audio/mpeg stream directly (synchronous, fast enough for short texts).
"""
import io
import logging
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)
router = APIRouter(tags=["tts"])


class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)
    voice: str = Field(default="vi-VN-HoaiMyNeural")


@router.post("/tts")
async def text_to_speech(req: TTSRequest):
    """
    Convert text to speech using Edge-TTS.
    Returns audio/mpeg stream.
    """
    try:
        import edge_tts

        communicate = edge_tts.Communicate(req.text, req.voice)
        audio_buffer = io.BytesIO()

        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_buffer.write(chunk["data"])

        audio_buffer.seek(0)

        if audio_buffer.getbuffer().nbytes == 0:
            raise HTTPException(status_code=500, detail="TTS produced no audio")

        return StreamingResponse(
            audio_buffer,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "inline; filename=tts_output.mp3",
                "Cache-Control": "public, max-age=3600",
            },
        )

    except ImportError:
        raise HTTPException(status_code=501, detail="edge-tts not installed")
    except Exception as e:
        logger.error(f"TTS error: {e}")
        raise HTTPException(status_code=500, detail="TTS failed")
