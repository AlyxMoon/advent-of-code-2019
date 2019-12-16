
export const generateArrayOfPermutations = (length = 0, min = 0, max = 0, i = 0) => {
  if (length <= 0 || min > max) return []

  const currentPermutations = [...Array(max - min + 1)].map((_, x) => x + min)

  const futurePermutations = i < length - 1
    ? generateArrayOfPermutations(length, min, max, i + 1)
    : []

  return futurePermutations.length === 0
    ? currentPermutations.map(p => [p])
    : currentPermutations.reduce((combined, p) => {
      return futurePermutations.reduce((combinedF, f) => [...combinedF, [p, ...f]], combined)
    }, [])
}

export const generateUniqueValueArrayOfPermutations = (length = 0, min = 0, max = 0) => {
  return generateArrayOfPermutations(length, min, max)
    .filter(permutation => permutation.every((val, i, p) => p.indexOf(val) === i))
}
