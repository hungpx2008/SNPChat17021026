/// <reference types="react" />
import type { IUser } from './SessionContext';
interface ISessionProviderProps {
    user?: IUser;
    disabledApi?: boolean;
    fallback?: React.ReactNode;
}
export declare const SessionProvider: React.FC<React.PropsWithChildren<ISessionProviderProps>>;
export {};
