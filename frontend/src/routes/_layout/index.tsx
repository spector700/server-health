import {createFileRoute, Link} from '@tanstack/react-router'
import {Header} from "@/components/sections/header.tsx";
import Section from "@/components/sections/section.tsx";

export const Route = createFileRoute('/_layout/')({
    component: Index,
})

function Index() {
    return (
        <>
            <Header/>
            <Section id="hero">
                {/* top left background gradient */}
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                     aria-hidden="true">
                    <div
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] top-left-background-gradient sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
                </div>

                {/* Hero content */}
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-32">
                    <div className="text-center">
                        <h1 className="title-gradient text-4xl font-bold text-balance sm:text-6xl">Hi</h1>
                        <p className="mt-6 text-lg text-muted-foreground">The description of Hi</p>
                        <Link href="/" to={"/"}>
                        </Link>
                    </div>

                    {/* bottom right background gradient */}
                    <div
                        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                        aria-hidden="true">
                        <div
                            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bottom-right-background-gradient sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
                    </div>
                </div>
            </Section>
        </>
    )
}