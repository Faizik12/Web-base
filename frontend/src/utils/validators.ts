export type Validator = (value: any) => string | null;

export const requiredValidator: Validator = (value) => {
  if (value === undefined || value === null || value === '') return 'Поле обязательно';
  return null;
};

export const emailValidator: Validator = (value) => {
  if (!value) return 'Email обязателен';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Некорректный email';
  return null;
};

export const numberValidator: Validator = (value) => {
  if (isNaN(Number(value))) return 'Должно быть числом';
  return null;
};

export const dateValidator: Validator = (value) => {
  if (isNaN(Date.parse(value))) return 'Некорректная дата';
  return null;
};

export const getDefaultValidator = (fieldName: string): Validator => {
  if (fieldName.includes('email')) return emailValidator;
  if (fieldName.includes('date')) return dateValidator;
  if (fieldName.includes('age') || fieldName.includes('count')) return numberValidator;
  return requiredValidator;
};