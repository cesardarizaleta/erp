import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

const ToastDemo = () => {
  const { toast } = useToast();

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: "Scheduled: Catch up",
            description: "Friday, February 10, 2023 at 5:57 PM",
          });
        }}
      >
        Default Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          });
        }}
      >
        Destructive Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: "Success!",
            description: "Your changes have been saved.",
          });
        }}
      >
        Success Toast
      </Button>
    </div>
  );
};

const meta: Meta<typeof ToastDemo> = {
  title: "UI/Toast",
  component: ToastDemo,
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
type Story = StoryObj<typeof ToastDemo>;

export const Default: Story = {};
