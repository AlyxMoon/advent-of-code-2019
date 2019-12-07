
defmodule Digit do
  def has_adjacent_digits?(number, previousDigit \\ -1) do
    if number > 9 do
      cutNumber = Integer.floor_div(number, 10)
      extraCutNumber = Integer.floor_div(number, 100)

      if rem(number, 10) === rem(cutNumber, 10) && rem(number, 10) !== previousDigit do
        if rem(number, 10) !== rem(extraCutNumber, 10) do
          true
        else
          has_adjacent_digits?(extraCutNumber, rem(cutNumber, 10))
        end
      else
        has_adjacent_digits?(cutNumber, rem(number, 10))
      end
    else
      false
    end
  end

  def has_equal_or_ascending_digits?(number) do
    if number > 9 do
      cutNumber = Integer.floor_div(number, 10)
      rem(number, 10) >= rem(cutNumber, 10) && has_equal_or_ascending_digits?(cutNumber)
    else
      true
    end
  end
end

{ :ok, content } = File.read("input.txt")
[rangeMin, rangeMax] = String.split(content, "-") |> Enum.map(&String.to_integer / 1)

possiblePasswords = Enum.count(
  rangeMin..rangeMax,
  fn i -> Digit.has_adjacent_digits?(i) && Digit.has_equal_or_ascending_digits?(i) end
)

IO.puts("Number of possible passwords: #{possiblePasswords}")
