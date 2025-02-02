export const updateFile = async (formData: FormData): Promise<string> => {
  const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/uploads`, {
    method: "POST",
    body: formData,
  });

  const { url: coverImage } = (await response.json()) as { url: string };

  return coverImage;
};
