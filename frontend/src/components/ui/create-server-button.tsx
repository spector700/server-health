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

export function CreateServerButton() {

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

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

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)

        try {
            const newServer = await serverApi.createServer(values);
            console.log('Server created:', newServer);
        } catch (error) {
            console.error('Error creating server:', error);
            setError(error instanceof Error ? error.message : 'Failed to create server');
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full">
            <Dialog onOpenChange={() => setError(null)}>
                <DialogTrigger asChild>
                    <Button variant="default" className="w-full flex justify-start items-center gap-2">
                        <PlusIcon/>
                        {loading ? "Creating..." : "Add Server"}
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
                                                <Input placeholder={`Dallas`} {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                            </div>
                            {error && (
                                <div style={{
                                    padding: '10px',
                                    background: '#fee',
                                    color: '#c00',
                                    borderRadius: '4px',
                                    marginBottom: '10px'
                                }}>
                                    {error}</div>
                            )}
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit"
                                        disabled={loading}>{loading ? "Creating..." : "Create"}</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
