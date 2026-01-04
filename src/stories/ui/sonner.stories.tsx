import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const SonnerDemo = () => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }
      >
        Default Sonner
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.success("Success", {
            description: "Operation completed successfully",
          })
        }
      >
        Success Sonner
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error("Error", {
            description: "Something went wrong",
          })
        }
      >
        Error Sonner
      </Button>
    </div>
  );
};

const meta: Meta<typeof SonnerDemo> = {
  title: "UI/Sonner",
  component: SonnerDemo,
  tags: ["autodocs"],
  decorators: [
    Story => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SonnerDemo>;

export const Default: Story = {};
