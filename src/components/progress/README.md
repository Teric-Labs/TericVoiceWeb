# Avoices progress system

| Category | Component | Use when |
|----------|-----------|----------|
| **GLOBAL_TOP** | `AvoicesGlobalBar` | Redux `ui.loading` — app-wide activity |
| **INLINE** | `ActivityStrip` | Form/page submit (thin bar under content) |
| **JOB** | `AvoicesJobProgress` | Determinate tasks with % (translation SSE, uploads) |
| **METRIC** | `AvoicesProgress` | Quotas, analytics breakdown, language coverage |
| **RING** | `AvoicesRingProgress` | Credit balance, circular KPIs |
| **OVERLAY** | `AvoicesBackdropLoader` | Studio fullscreen processing (pass `progress` for %; omit for indeterminate) |
| **SPINNER** | `AvoicesSpinner` | Buttons, cards, inline loading states |
| **STEPPER** | MUI `Stepper` + `STEPPER_SX` | Multi-step studios (workflow, not % time) |
| **SKELETON** | MUI `Skeleton` | Table/list placeholders |
| **MEDIA** | react-h5-audio-player | Playback scrubber only — do not replace |

Import from `./progress` or `../components/progress`.
