const {
  findBestLocation,
  fireTheLaserBeam,
} = require('@lib/programs/standalone/MonitoringStationLocationFinder')

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

  it('gets correct nth asteroid when firing laser beam 1', () => {
    const input = formatInput(`
      .#....#####...#..
      ##...##.#####..##
      ##...#...#.#####.
      ..#.....#...###..
      ..#.#.....#....##
    `)

    expect(fireTheLaserBeam(input, 1)).toEqual([8, 1])
    expect(fireTheLaserBeam(input, 10)).toEqual([12, 2])
    expect(fireTheLaserBeam(input, 19)).toEqual([2, 4])
  })

  it('gets correct nth asteroid when firing laser beam 2', () => {
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

    expect(fireTheLaserBeam(input, 1)).toEqual([11, 12])
    expect(fireTheLaserBeam(input, 10)).toEqual([12, 8])
    expect(fireTheLaserBeam(input, 50)).toEqual([16, 9])
    expect(fireTheLaserBeam(input, 200)).toEqual([8, 2])
    expect(fireTheLaserBeam(input, 299)).toEqual([11, 1])
  })
})
