import type { LucideIcon } from 'lucide-react'
import {
  FileArchive, RefreshCw, FileSearch, FilePlus, Scissors, RotateCw,
  Trash2, FileOutput, LayoutDashboard, Crop, PenLine, EyeOff,
  Shield, Hash, Layers, ShieldCheck, LockOpen, Edit, BookOpen,
  Pencil, Clipboard, ShieldOff, FileText, Table, Globe, FileCode,
  Image as ImageIcon, Smartphone, Maximize2, ArrowLeftRight,
  Music, Volume2, Video, Film, Bot, MessageSquare, Sparkles,
  Languages, HelpCircle, Download, Code, FileEdit,
} from 'lucide-react'

// Maps every icon name used in tools-registry.ts to a safe lucide-react component.
// Uncertain icon names (FilePlus2, ScanSearch, etc.) are mapped to safe equivalents.
const ICON_MAP: Record<string, LucideIcon> = {
  // ── PDF tools ──────────────────────────────────────────────────────────────
  FileArchive,
  RefreshCw,
  ScanSearch:     FileSearch,
  FilePlus2:      FilePlus,
  Scissors,
  RotateCw,
  Trash2,
  FileDown:       FileOutput,
  LayoutDashboard,
  Crop,
  PenLine,
  EyeOff,
  Stamp:          Shield,
  Hash,
  Layers,
  ShieldCheck,
  LockOpen,
  PenSquare:      Edit,
  BookOpen,
  Highlighter:    Pencil,
  ClipboardType:  Clipboard,
  ShieldOff,

  // ── Convert ────────────────────────────────────────────────────────────────
  FileText,
  FileOutput,
  Presentation:   LayoutDashboard,
  Table,
  FileSpreadsheet: Table,
  Image:          ImageIcon,
  ImagePlus:      ImageIcon,
  FileImage:      ImageIcon,
  Globe,
  FileCode,
  FileCode2:      FileCode,

  // ── AI ─────────────────────────────────────────────────────────────────────
  Bot,
  MessageSquare,
  Sparkles,
  Languages,
  BrainCircuit:   HelpCircle,

  // ── Image ──────────────────────────────────────────────────────────────────
  ImageDown:      Download,
  Smartphone,
  Maximize2,
  ShieldX:        ShieldOff,
  ArrowLeftRight,

  // ── Document ───────────────────────────────────────────────────────────────
  ScanText:       FileSearch,
  Braces:         Code,

  // ── Audio ──────────────────────────────────────────────────────────────────
  Music,
  Volume2,
  AudioLines:     Music,

  // ── Video ──────────────────────────────────────────────────────────────────
  Video,
  Film,

  // ── Category icons ─────────────────────────────────────────────────────────
  FileEdit,

  // ── Misc fallbacks ─────────────────────────────────────────────────────────
  FilePlus,
  Edit,
  Code,
  Download,
  Shield,
  HelpCircle,
}

export function ToolIcon({
  name,
  className,
  style,
}: {
  name: string
  className?: string
  style?: React.CSSProperties
}) {
  const Icon = ICON_MAP[name] ?? FileText
  return <Icon className={className} style={style} />
}
