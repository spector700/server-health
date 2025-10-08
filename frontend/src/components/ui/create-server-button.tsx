import {useState} from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {PlusIcon} from "lucide-react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {serverApi} from "@/services/api.tsx";
import {useMutation, useQueryClient} from "@tanstack/react-query";

export function CreateServerButton() {
    const queryClient = useQueryClient();

    const [open, setOpen] = useState(false);

    const formSchema = z.object({
        name: z.string().min(2).max(50),
        hostname: z.string().min(2).max(50),
        ipAddress: z.string().regex(
            /^(?:\d{1,3}\.){3}\d{1,3}$/,
            "Must be a valid IPv4 address"
        ),
        port: z.string().refine(val => {
            const n = Number(val);
            return n >= 1 && n <= 65535 && Number.isInteger(n);
        }, "Invalid port number"),
        location: z.string().min(2).max(50),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            hostname: "",
            ipAddress: "",
            port: "80",
            location: "",
        }
    })


    // Use TanStack Query mutation
    const createMutation = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            // Convert port string to number and prepare data
            await serverApi.createServer(values);
        },
        onSuccess: async (newServer) => {
            console.log('Server created:', newServer);

            // Invalidate and refetch servers query
            await queryClient.invalidateQueries({queryKey: ['servers']});

            // Close dialog and reset form
            setOpen(false);
            form.reset();
        },
        onError: (error) => {
            console.error('Error creating server:', error);
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        createMutation.mutate(values);
    }

    return (
        <div className="w-full">
            <Dialog open={open} onOpenChange={(val) => {
                setOpen(val)
            }}>
                <DialogTrigger asChild>
                    <Button variant="default" className="w-full flex justify-start items-center gap-2">
                        <PlusIcon/>
                        Add Server
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <Form {...form}>
                        <DialogHeader>
                            <DialogTitle>Add Server</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-5 py-4">
                                <FormField
                                    name="name"
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder={`Name`} {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                <FormField
                                    name="hostname"
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Hostname</FormLabel>
                                            <FormControl>
                                                <Input placeholder={`server.local`} {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                        name="ipAddress"
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>IP Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={`192.168.1.100`} {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}/>

                                    <FormField
                                        name="port"
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Port</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={`8080`} {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}/>
                                </div>

                                <FormField
                                    name="location"
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            <FormControl>
                                                <Input placeholder={`Home`} {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                            </div>
                            {createMutation.isError && (
                                <div style={{
                                    padding: '10px',
                                    background: '#fee',
                                    color: '#c00',
                                    borderRadius: '4px',
                                    marginBottom: '10px'
                                }}>
                                    {createMutation.error.message}
                                </div>
                            )}
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit"
                                        disabled={createMutation.isPending}
                                >{createMutation.isPending ? "Creating..." : "Create"}</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
