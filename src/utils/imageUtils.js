import { getSkillImageUrl } from '../../utils/imageUtils';

export const getSkillImageUrl = (skill) => {
  const imageUrl = skill?.imageUrl ||
    skill?.imagem_url ||
    skill?.image_url ||
    skill?.imagemUrl ||
    skill?.url ||
    skill?.img ||
    skill?.photo ||
    skill?.picture;
  
  return imageUrl && imageUrl.trim() !== '' ? imageUrl : '/placeholder-skill.png';
};

export const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
  }
};