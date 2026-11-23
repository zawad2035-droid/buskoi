<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Bus data lives in `src/data/bus-routes.ts` (generated from the user's route list) and stop map positions in `src/data/stop-coordinates.ts`; every stop name in the routes must have a coordinate entry, or its distance silently counts as zero.
- All route search logic is pure and client-side in `src/lib/route-finder.ts` (no backend needed); spelling variants of the same stop are merged via its alias map.
- Distances are estimates: straight-line distance between consecutive stops times a road factor, so the UI must keep labelling them approximate.
- The search state lives in the URL (`?from=&to=`) so results are shareable.
- UI motion uses framer-motion and must honour `useReducedMotion` (plus the global reduced-motion CSS rule); animations never delay or gate search results.
