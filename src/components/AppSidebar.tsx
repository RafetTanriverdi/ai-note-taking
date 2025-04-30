import { Note } from '@prisma/client';
import { getUser } from '@rt/auth/server';
import SidebarGroupContent from '@rt/components/SidebarGroupContent';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from '@rt/components/ui/sidebar';
import { prisma } from '@rt/db/prisma';
import { Link } from 'lucide-react';

async function AppSidebar() {
  const user = await getUser();

  let notes: Note[] = [];
  if (user) {
    notes = await prisma.note.findMany({
      where: {
        authorId: user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent className="custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel>
            {user ? (
              'Your Notes'
            ) : (
              <p>
                <Link href="/login" className="underline">
                  Login
                </Link>
              </p>
            )}
          </SidebarGroupLabel>

          {user && <SidebarGroupContent notes={notes} />}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
export default AppSidebar;
