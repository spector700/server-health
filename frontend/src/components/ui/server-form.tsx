import {z} from "zod";
import {type Resolver, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {DialogClose, DialogFooter} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";


const serverFormSchema = z.object({
    name: z.string().min(2).max(50),
    hostname: z.string().min(2).max(50),
    checkType: z.enum(['ping', 'port']).default('ping'),
    // optional ip address
    ipAddress: z.string().regex(
        /^(?:\d{1,3}\.){3}\d{1,3}$/,
        "Must be a valid IPv4 address"
    ).optional().or(z.literal('')),
    port: z.coerce.number().min(1).max(65535),
    // optional location
    location: z.string().min(2).max(50).optional().or(z.literal('')),
});

export type ServerFormValues = z.infer<typeof serverFormSchema>

interface ServerFormProps {
    defaultValues?: Partial<ServerFormValues>;
    onSubmit: (values: ServerFormValues) => void;
    isLoading: boolean;
    error?: string | null;
    submitLabel?: string;
}

export function ServerForm({
                               defaultValues,
                               onSubmit,
                               isLoading,
                               error,
                               submitLabel = "Submit"
                           }: ServerFormProps) {
    const form = useForm<ServerFormValues>({
        resolver: zodResolver(serverFormSchema) as Resolver<ServerFormValues>,
        defaultValues: {
            name: defaultValues?.name || "",
            hostname: defaultValues?.hostname || "",
            checkType: defaultValues?.checkType || "ping",
            ipAddress: defaultValues?.ipAddress || "",
            port: defaultValues?.port || 80,
            location: defaultValues?.location || "",
        }
    });
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-5 py-4">
                    <FormField
                        name="name"
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="web-server-1" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="hostname"
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Hostname</FormLabel>
                                <FormControl>
                                    <Input placeholder="server.local" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="checkType"
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Check Type</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select check type"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="ping">Ping (ICMP)</SelectItem>
                                        <SelectItem value="port">Port</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <FormField
                            name="ipAddress"
                            control={form.control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>IP Address (optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="192.168.1.100" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="port"
                            control={form.control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Port</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="80"
                                            type="number"
                                            {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        name="location"
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Location (optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Home" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                {error && (
                    <div style={{
                        padding: '10px',
                        background: '#fee',
                        color: '#c00',
                        borderRadius: '4px',
                        marginBottom: '10px'
                    }}>
                        {error}
                    </div>
                )}

                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving..." : submitLabel}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    )
}