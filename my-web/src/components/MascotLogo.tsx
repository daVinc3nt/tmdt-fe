import logoImage from "./Images/logo-removebg-preview.png";

type MascotLogoProps = {
  className?: string;
};

export function MascotLogo({ className = "" }: MascotLogoProps) {
  return (
    <img
      src={logoImage}
      alt="FitConnect Logo"
      className={`object-contain ${className}`}
    />
  );
}
