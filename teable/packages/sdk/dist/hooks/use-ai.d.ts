interface IUseAIStreamOptions {
    timeout?: number;
}
export declare const useAIStream: (options?: IUseAIStreamOptions) => {
    text: string;
    generateAIResponse: (prompt: string) => Promise<void>;
    loading: boolean;
    error: string | null;
    stop: () => void;
};
export {};
