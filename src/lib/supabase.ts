import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import formidable from 'formidable';

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadImage = async (file: formidable.File, bucket: string = 'uploads'): Promise<string> => {
  try {
    const filePath = file.filepath;
    const fileName = `${Date.now()}_${file.originalFilename}`;
    const fileBuffer = fs.readFileSync(filePath);

    // Subimos el archivo al bucket en Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`images/${fileName}`, fileBuffer, {
        contentType: file.mimetype || 'image/jpeg',
        cacheControl: '3600', // Cachear por 1 hora
        upsert: false, // Evitar sobreescritura de archivos existentes
      });

    if (error) throw error;

    // Obtenemos la URL pública del archivo subido
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(`images/${fileName}`);

    if (!publicUrlData?.publicUrl) throw new Error('No se pudo obtener la URL pública.');

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    throw error;
  }
};
