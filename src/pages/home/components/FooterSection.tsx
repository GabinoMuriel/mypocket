import { Logo } from "@/components/app/Logo";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { SendIcon } from "lucide-react";

export default function FooterSection() {
  return (
    <footer className="py-12">
      <div className="container mx-auto space-y-6 px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="text-muted-foreground text-sm">
              Tu dinero bajo control, estés donde estés y sin complicaciones.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Programs</h3>
            <ul className="[&_li_a]:text-muted-foreground [&_li_a]:hover:text-foreground space-y-2 [&_li_a]:block [&_li_a]:text-sm [&_li_a]:transition-colors [&_li_a]:hover:underline">
              <li>
                <a href="/programs">Strength Training</a>
              </li>
              <li>
                <a href="/programs">HIIT Classes</a>
              </li>
              <li>
                <a href="/programs">Yoga & Wellness</a>
              </li>
              <li>
                <a href="/programs">Personal Training</a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="[&_li_a]:text-muted-foreground [&_li_a]:hover:text-foreground space-y-2 [&_li_a]:block [&_li_a]:text-sm [&_li_a]:transition-colors [&_li_a]:hover:underline">
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/trainers">Our Trainers</a>
              </li>
              <li>
                <a href="/membership">Membership</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Newsletter</h3>
            <p className="text-muted-foreground text-sm">
              Stay updated with fitness tips and offers.
            </p>
            <div className="flex space-x-2">
              <InputGroup>
                <InputGroupInput type="email" placeholder="Your email" />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton variant="secondary">
                    <span className="hidden lg:inline">Subscribe</span>
                    <SendIcon className="inline lg:hidden" />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        </div>
        <Separator className="lg:mt-10" />
        <div className="text-muted-foreground text-center">
          <div className="text-xs">
            &copy; {new Date().getFullYear()} MyPocket. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
