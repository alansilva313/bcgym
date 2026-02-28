import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const bucketName = process.env.SUPABASE_BUCKET || 'gym-gifs';

if (!supabaseUrl || !supabaseKey) {
    console.warn("AVISO: SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configurados no .env. Upload de arquivos falhará.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadToSupabase = async (file: Express.Multer.File): Promise<string> => {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;
    const filePath = `exercises/${fileName}`;

    const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });

    if (error) {
        throw new Error(`Erro no upload para o Supabase: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

    return publicUrl;
};
