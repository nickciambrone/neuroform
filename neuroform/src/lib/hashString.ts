export function hashSearchTarget({ name, description, tags }: { name: string; description: string; tags: string }) {
    const str = `${name.trim()}|${description.trim()}|${tags.trim()}`;
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(str)).then((buf) => {
      return [...new Uint8Array(buf)]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")
        .slice(0, 24); // trim for nicer ID length
    });
  }
  