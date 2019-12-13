
const main = () => {
  const parameters1 = [0, 1]
  const parameters2 = [0, 1]
  const parameters3 = [0, 1]
  const parameters4 = [0, 1]

  const generatePermutationsPlease = (arr, i = 0) => {
    const currentPermutations = [...Array(arr[i][1] - arr[i][0] + 1)].map((_, i) => i + arr[i][0])

    const futurePermutations = i < arr.length - 1
      ? generatePermutationsPlease(arr, i + 1)
      : []

    return futurePermutations.length === 0
      ? currentPermutations.map(p => [p])
      : currentPermutations.reduce((combined, p) => {
        return futurePermutations.reduce((combinedF, f) => [...combinedF, [p, ...f]], combined)
      }, [])
  }

  const parametersArray = [parameters1, parameters2, parameters3, parameters4]
  const arr2 = generatePermutationsPlease(parametersArray)
  console.log(arr2)
}

main()
