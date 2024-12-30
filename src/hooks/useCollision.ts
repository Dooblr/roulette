import { useCallback } from 'react'

interface Vector2D {
  x: number
  y: number
}

interface CollisionConfig {
  circleRadius: number
  ballRadius: number
  friction: number
  pullToCenter: number
}

export const useCollision = (config: CollisionConfig) => {
  const { circleRadius, ballRadius, friction, pullToCenter } = config

  const handleCollision = useCallback((pos: Vector2D, vel: Vector2D): { pos: Vector2D, vel: Vector2D } => {
    const distance = Math.sqrt(pos.x * pos.x + pos.y * pos.y)
    
    if (distance > circleRadius - ballRadius) {
      // Calculate tangent vector (perpendicular to normal)
      const normal: Vector2D = {
        x: pos.x / distance,
        y: pos.y / distance
      }
      const tangent: Vector2D = {
        x: -normal.y,
        y: normal.x
      }

      // Project velocity onto tangent for sliding motion
      const tangentDot = vel.x * tangent.x + vel.y * tangent.y
      const slideVelocity: Vector2D = {
        x: tangent.x * tangentDot * friction,
        y: tangent.y * tangentDot * friction
      }

      // Add inward pull
      const pullVelocity: Vector2D = {
        x: -normal.x * pullToCenter,
        y: -normal.y * pullToCenter
      }

      // Combine velocities
      const newVel: Vector2D = {
        x: slideVelocity.x + pullVelocity.x,
        y: slideVelocity.y + pullVelocity.y
      }

      // Keep ball on the circle's edge
      const newPos: Vector2D = {
        x: normal.x * (circleRadius - ballRadius),
        y: normal.y * (circleRadius - ballRadius)
      }

      return { pos: newPos, vel: newVel }
    }

    return { pos, vel }
  }, [circleRadius, ballRadius, friction, pullToCenter])

  return handleCollision
} 