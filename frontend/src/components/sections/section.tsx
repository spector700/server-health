import {merge} from '@/lib/utils'
import React from 'react'

interface SectionProps {
    className?: string
    id?: string
    customPaddings?: string
    children?: React.ReactNode
}

export default function Section({
                                    className,
                                    id,
                                    customPaddings,
                                    children,
                                }: SectionProps) {
    const paddingClasses = merge('relative isolate container mx-auto', customPaddings || 'mb-10 px-4 lg:px-16 py-8 lg:py-16')

    return (
        <div
            id={id}
            className={merge(paddingClasses, className)}
        >
            {children}
        </div>
    )
}