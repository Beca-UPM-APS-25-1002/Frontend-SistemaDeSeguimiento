/**
 * Determines if a month is in the past or current based on academic year perspective
 * where September (9) is the start of the academic year.
 */
export function isInPastOrCurrentAcademicMonth(
  seguimientoMonth: number,
  currentMonth: number
): boolean {
  // Convert both months to 0-based system where September = 0, October = 1, etc.
  const academicSeguimientoMonth = (seguimientoMonth + 3) % 12;
  const academicCurrentMonth = (currentMonth + 3) % 12;

  return academicSeguimientoMonth <= academicCurrentMonth;
}

/**
 * Compares two months based on academic year ordering perspective
 * where September (9) is the start of the academic year
 * @Returns positive if a > b, negative if a < b, 0 if equal
 */
export function compareAcademicMonths(a: number, b: number): number {
  // Convert both months to 0-based system where September = 0, October = 1, etc.
  const academicMonthA = (a + 3) % 12;
  const academicMonthB = (b + 3) % 12;

  return academicMonthA - academicMonthB;
}
