import { render } from "@testing-library/react";
import { ReactElement, FC } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <HelmetProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </HelmetProvider>
  );
};

export const customRender = (ui: ReactElement, options?: any) =>
  render(ui, { wrapper: AllTheProviders, ...options });
