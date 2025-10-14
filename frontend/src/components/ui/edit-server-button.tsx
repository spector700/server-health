import {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {PencilIcon} from "lucide-react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {serverApi} from "@/services/api.tsx";
import {ServerForm, type ServerFormValues} from "@/components/ui/server-form.tsx";
import type {Server} from "@/types/api.tsx";

interface EditServerButtonProps {
    server: Server;
}

export function EditServerButton({server}: EditServerButtonProps) {

    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient()

    // Use TanStack Query mutation
    const updateMutation = useMutation({
        mutationFn: async (values: ServerFormValues) => {
            return serverApi.updateServer(server.id, {
                ...values,
                // ipAddress: values.ipAddress || undefined,
                // location: values.location || undefined,
            })
        },
        onSuccess: async (updatedServer) => {
            console.log('Server updating:', updatedServer);

            // Invalidate and refetch servers query
            await queryClient.invalidateQueries({queryKey: ['servers']});

            // Close dialog and reset form
            setOpen(false);
        },
        onError: (error) => {
            console.error('Error updating server:', error);
        }
    })

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val)
            if (!val) {
                updateMutation.reset();
            }
        }}>
            <DialogTrigger asChild>
                <Button variant="ghost">
                    <PencilIcon/>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Server</DialogTitle>
                </DialogHeader>
                <ServerForm
                    key={open ? server.id : 'closed'}
                    defaultValues={{
                        name: server.name,
                        hostname: server.hostname,
                        checkType: server.checkType,
                        ipAddress: server.ipAddress || "",
                        port: server.port,
                        location: server.location || "",
                    }}
                    onSubmit={(values) => updateMutation.mutate(values)}
                    isLoading={updateMutation.isPending}
                    error={updateMutation.error instanceof Error ? updateMutation.error.message : undefined}
                    submitLabel="Update"
                >
                </ServerForm>
            </DialogContent>
        </Dialog>
    );
}
