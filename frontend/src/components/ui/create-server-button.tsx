import {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {PlusIcon} from "lucide-react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {serverApi} from "@/services/api.tsx";
import {ServerForm, type ServerFormValues} from "@/components/ui/server-form.tsx";

export function CreateServerButton() {

    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient()

    // Use TanStack Query mutation
    const createMutation = useMutation({
        mutationFn: async (values: ServerFormValues) => {
            return serverApi.createServer({
                ...values,
                ipAddress: values.ipAddress || undefined,
                location: values.location || undefined,
            })
        },
        onSuccess: async (newServer) => {
            console.log('Server created:', newServer);

            // Invalidate and refetch servers query
            await queryClient.invalidateQueries({queryKey: ['servers']});

            // Close dialog and reset form
            setOpen(false);
        },
        onError: (error) => {
            console.error('Error creating server:', error);
        }
    })

    return (
        <div className="w-full">
            <Dialog open={open} onOpenChange={(val) => {
                setOpen(val)
                if (!val) {
                    // reset form if dialog closed
                    createMutation.reset();
                }
            }}>
                <DialogTrigger asChild>
                    <Button variant="default" className="w-full flex justify-start items-center gap-2">
                        <PlusIcon/>
                        Add Server
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Server</DialogTitle>
                    </DialogHeader>
                    <ServerForm onSubmit={(values) => createMutation.mutate(values)}
                                isLoading={createMutation.isPending}
                                error={createMutation.error instanceof Error ? createMutation.error.message : undefined}
                                submitLabel="Create"
                    >

                    </ServerForm>
                </DialogContent>
            </Dialog>
        </div>
    );
}
