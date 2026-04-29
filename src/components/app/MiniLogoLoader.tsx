const MiniLogoLoader = ({ className = "w-8 h-8" }) => {
  return (
    <div className={`inline-block perspective-1000 ${className}`}>
      <img
        src="/assets/logos/logo_small_ts.png"
        alt="Loading..."
        className="w-full h-full object-contain animate-rotate-3d dark:brightness-150"
      />
    </div>
  );
};

export default MiniLogoLoader;
