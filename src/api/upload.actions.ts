export const updateFile = async (formData: FormData): Promise<string> => {
  const response = await fetch("http://localhost:4000/uploads", {
    method: "POST",
    body: formData,
  });

  const { url: coverImage } = (await response.json()) as { url: string };

  return coverImage;
};
