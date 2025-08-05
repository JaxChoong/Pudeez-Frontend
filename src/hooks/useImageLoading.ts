"use client"

import { useState, useCallback } from "react"

/**
 * Custom hook to manage the loading state of an image.
 * Returns isLoading (boolean) and handleImageLoad (function).
 */
export function useImageLoading() {
  const [isLoading, setIsLoading] = useState(true)

  const handleImageLoad = useCallback(() => {
    setIsLoading(false)
  }, [])

  return { isLoading, handleImageLoad }
}
