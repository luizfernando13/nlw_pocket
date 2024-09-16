import { Plus, Trash2 } from 'lucide-react'
import { OutlineButton } from './ui/outline-button'
import { getPendingGoals } from '../http/get-pending-goals'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createGoalCompletion } from '../http/create-goal-completion'
import { getSummary } from '../http/get-summary'
import deleteGoal from '../http/delete-goal'

export function PendingGoals() {
  const queryClient = useQueryClient()

  const { data: goals } = useQuery({
    queryKey: ['pending-goals'],
    queryFn: getPendingGoals,
    staleTime: 1000 * 60,
  })

  const { data: summaryData } = useQuery({
    queryKey: ['summary'],
    queryFn: getSummary,
    staleTime: 1000 * 60,
  })

  if (!goals) return null

  const today = new Date().toISOString().split('T')[0]

  // Checa se o goal title já foi concluído hoje
  const titlesCompletedToday = new Set()
  if (summaryData?.goalsPerDay && summaryData.goalsPerDay[today]) {
    for (const goal of summaryData.goalsPerDay[today]) {
      titlesCompletedToday.add(goal.title)
    }
  }

  async function handleCompletionGoal(goalId: string) {
    await createGoalCompletion(goalId)
    queryClient.invalidateQueries({ queryKey: ['summary'] })
    queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
  }

  async function handleDeleteGoal(goalId: string) {
    await deleteGoal(goalId)
    queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
    queryClient.invalidateQueries({ queryKey: ['summary'] })
  }

  return (
    <div className="flex flex-wrap gap-3">
      {goals.map(goal => (
        <div key={goal.id} className="flex items-center gap-2">
          <OutlineButton className='hover:bg-zinc-900'
            disabled={
              goal.completionCount >= goal.desiredWeeklyFrequency ||
              titlesCompletedToday.has(goal.title)
            }
            onClick={() => handleCompletionGoal(goal.id)}
          >
            <Plus className="size-4 text-zinc-600" />
            {goal.title}
          </OutlineButton>
          <button
            type="button"
            onClick={() => handleDeleteGoal(goal.id)}
            className="text-red-600"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
