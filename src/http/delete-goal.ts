export default async function deleteGoal(goalId: string) {
  const apiUrl = import.meta.env.VITE_API_URL
  await fetch(`${apiUrl}/delete-goal`, {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json',
    },
    body: JSON.stringify({
      goalId,
    })
  })
}