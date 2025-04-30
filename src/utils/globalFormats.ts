export function getLocation(language: string): 'en-US' | 'pt-BR' {
  return language === 'en' ? 'en-US' : 'pt-BR';
}

export function getCurrency(language: string): 'USD' | 'BRL' {
  return language === 'en' ? 'USD' : 'BRL';
}

export function getLocalDate(date: Date): string {
  const year: number = date.getFullYear();
  const day: string = date.getDate().toString().padStart(2, '0');
  const month: string = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDate(date: Date, language: string): string {
  return new Date(date).toLocaleDateString(getLocation(language), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function formatCurrency(
  value: bigint | number | undefined,
  language: string
): string | undefined {
  return value?.toLocaleString(getLocation(language), {
    currency: getCurrency(language),
    minimumFractionDigits: 2,
    style: 'currency',
  });
}
