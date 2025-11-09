export default function Avatar({ variant = 'default', label }) {
  const src = {
    default: '/avatars/default.png',
    dell: '/avatars/dell.png',
    cisco: '/avatars/cisco.png',
    netbackup: '/avatars/netbackup.png',
    commvault: '/avatars/commvault.png',
  }[variant] || '/avatars/default.png';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-40 h-40 bg-brand.gray rounded-2xl flex items-center justify-center overflow-hidden border">
        <img src={src} alt={label || variant} className="object-contain w-full h-full" />
      </div>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </div>
  );
}
