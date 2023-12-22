import { Separator } from "@/components/ui/separator"
import GetPatronForm from "./get-patron"

export default function PatronCreateForm() {

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Find Patrons</h3>
        <p className="text-sm text-muted-foreground">
          Search for and edit Patron data.
        </p>
      </div>
      <Separator />
      <GetPatronForm />
    </div>
  )
}

