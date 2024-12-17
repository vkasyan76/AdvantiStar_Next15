import { parseAsString, useQueryState } from "nuqs";

export function useSearchParam() {
  return useQueryState(
    // key,
    "search",
    parseAsString.withDefault("").withOptions({ clearOnDefault: true })
  );
}

// original version: since we use only one search param, we can hardcode the key
// export function useSearchParam(key: string) {
//   return useQueryState(
//     key,
//     parseAsString.withDefault("").withOptions({ clearOnDefault: true })
//   );
// }
