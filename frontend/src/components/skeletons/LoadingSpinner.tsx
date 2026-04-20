const LoadingSpinner = ({
  size = "md",
}: {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}) => {
  const sizeClass = `loading-${size}`;

  return <span className={`loading loading-spinner ${sizeClass}`} />;
};
export default LoadingSpinner;
