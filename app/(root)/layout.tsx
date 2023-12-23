import { Nav } from "@/components/nav"
import { Navbar } from "@/components/navbar"
import { Users } from "lucide-react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      {/* <Navbar /> */}
      <Nav
        isCollapsed={false}
      />
      {children}
    </div>        
  )
}
