export interface UserProfileProps {
    id: string;
    firebase_uid: string;
    firstname: string;
    lastname: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    photo_url: string;
    role: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}