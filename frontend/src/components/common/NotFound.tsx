import Section from '@/components/sections/section'

function NotFound() {
    return (
        <Section className="flex justify-center items-center h-screen">
            <div className="inline-flex items-center justify-center gap-6">
                <h1 className="text-3xl">404</h1>
                <div className="border-r text-muted-foreground h-12"></div>
                <h2 className="leading-10">
                    <strong className="mr-3">Opsy!</strong>
                    Page not found
                </h2>
            </div>
        </Section>
    )
}

export default NotFound