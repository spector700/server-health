// import { MainLogo } from '@/components/common/main-logo'
// import { MobileMenu } from '@/components/common/mobile-menu'
// import { ThemeModeToggle } from '@/components/ui/theme-mode-toggle'
// import { MenuLinks } from '../common/menu-links'

export function Header() {
    return (
        <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-sm">
            <div className="flex items-center justify-between px-5 lg:px-7 xl:px-10 h-16">
                eseessesesesesese amoung us
                {/*<MainLogo to="/" />*/}
                <ul className="hidden md:inline-flex items-center justify-center space-x-1 fixed left-1/2 right-1/2">
                    {/*<MenuLinks />*/}
                </ul>

                <div className="hidden md:flex items-center space-x-5">
                    {/*<ThemeModeToggle />*/}
                </div>
                {/*<MobileMenu />*/}
            </div>
        </header>
    )
}