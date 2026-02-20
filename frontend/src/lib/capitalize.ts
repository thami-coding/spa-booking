export function capitalizeFirst(str: string): string {
  if (str.includes("_")) {
    const [_, second] = str.split("_");
    str =  second;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}
