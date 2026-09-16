"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

/**
 * Editing is handled via CourseModal on the category list page.
 * Redirect back, passing ?edit=<id> so the list page opens the modal.
 */
export default function EditRedirectPage() {
    const { locale, category, id } = useParams<{ locale: string; category: string; id: string }>();
    const router = useRouter();

    useEffect(() => {
        router.replace(`/${locale}/admin/courses/${category}?edit=${id}`);
    }, [locale, category, id, router]);

    return null;
}
