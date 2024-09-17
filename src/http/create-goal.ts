interface CreateGoalRequest {
  title: string;
  desiredWeeklyFrequency: number;
}

export async function createGoal({
  title,
  desiredWeeklyFrequency,
}: CreateGoalRequest) {
  const apiUrl = import.meta.env.VITE_API_URL
  const response = await fetch(`${apiUrl}/goals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      desiredWeeklyFrequency,
    }),
  });

  // Verificar se a requisição foi bem-sucedida
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro ao criar a meta');
  }

  return await response.json(); // Retornar a resposta em caso de sucesso
}
