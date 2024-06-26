import Image from "next/image"

export const Loader = () => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center">
      <div className="w-16 h-16 relative animate-spin">
        <Image
          alt="logo"
          fill
          src="/logo.png"
          sizes="small"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        AURA Direct is thinking...
      </p>
    </div>
  )
}
