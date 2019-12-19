const { findBestLocation } = require('@lib/programs/MonitoringStationLocationFinder')

const formatInput = (input) => {
  return input.trim().split('\n').map(line => line.trim().split(''))
}

describe('MonitoringStationLocationFinder', () => {
  it('works with sample 1', () => {
    const input = formatInput(`
      .#..#
      .....
      #####
      ....#
      ...##
    `)
    expect(findBestLocation(input)).toEqual([8, [3, 4]])
  })

  it('works with sample 2', () => {
    const input = formatInput(`
      ......#.#.
      #..#.#....
      ..#######.
      .#.#.###..
      .#..#.....
      ..#....#.#
      #..#....#.
      .##.#..###
      ##...#..#.
      .#....####
    `)
    expect(findBestLocation(input)).toEqual([33, [5, 8]])
  })

  it('works with sample 3', () => {
    const input = formatInput(`
      #.#...#.#.
      .###....#.
      .#....#...
      ##.#.#.#.#
      ....#.#.#.
      .##..###.#
      ..#...##..
      ..##....##
      ......#...
      .####.###.
    `)
    expect(findBestLocation(input)).toEqual([35, [1, 2]])
  })

  it('works with sample 4', () => {
    const input = formatInput(`
      .#..#..###
      ####.###.#
      ....###.#.
      ..###.##.#
      ##.##.#.#.
      ....###..#
      ..#.#..#.#
      #..#.#.###
      .##...##.#
      .....#.#..
    `)
    expect(findBestLocation(input)).toEqual([41, [6, 3]])
  })

  it('works with sample 5', () => {
    const input = formatInput(`
      .#..##.###...#######
      ##.############..##.
      .#.######.########.#
      .###.#######.####.#.
      #####.##.#.##.###.##
      ..#####..#.#########
      ####################
      #.####....###.#.#.##
      ##.#################
      #####.##.###..####..
      ..######..##.#######
      ####.##.####...##..#
      .#####..#.######.###
      ##...#.##########...
      #.##########.#######
      .####.#.###.###.#.##
      ....##.##.###..#####
      .#.#.###########.###
      #.#.#.#####.####.###
      ###.##.####.##.#..##
    `)
    expect(findBestLocation(input)).toEqual([210, [11, 13]])
  })
})
