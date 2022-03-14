export default async request => {
  let result = { results: [] }
  while (true) {
    const pageResult = await request({ start_cursor: result.next_cursor })
    result = {
      ...result,
      ...pageResult,
      results: [...result.results, ...pageResult.results],
    }
    if (!result.has_more) {
      return result
    }
  }
}
