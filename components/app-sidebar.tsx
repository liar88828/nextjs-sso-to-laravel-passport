import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link";
import * as React from "react"

// This is sample data.
const data = {
    navMain: [
        {
            title: "Main Menu",
            url: "home",
            items: [
                {
                    title: "User",
                    url: "user",
                },
                {
                    title: "Project Structure",
                    url: "product",
                },
            ],
        },
    ]

}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar { ...props }>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="#">
                                <div
                                    className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <GalleryVerticalEnd className="size-4"/>
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-medium">Documentation</span>
                                    <span className="">v1.0.0</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        { data.navMain.map((item) => (
                            <SidebarMenuItem key={ item.title }>
                                <SidebarMenuButton asChild>
                                    <a href={ item.url } className="font-medium">
                                        { item.title }
                                    </a>
                                </SidebarMenuButton>
                                { item.items?.length ? (
                                    <SidebarMenuSub>
                                        { item.items.map((item) => (
                                            <SidebarMenuSubItem key={ item.title }>
                                                <SidebarMenuSubButton asChild >
                                                    <Link href={ item.url }>{ item.title }</Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        )) }
                                    </SidebarMenuSub>
                                ) : null }
                            </SidebarMenuItem>
                        )) }
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail/>
        </Sidebar>
    )
}
