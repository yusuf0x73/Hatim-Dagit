//                                     BİSMİLLAHİRRAHMANİRRAHİM

import React from 'react';
import {createStyles, ThemeIcon, Progress, Text, Group, Badge, Paper, Button} from '@mantine/core';
import {Book, Trash, Pencil, CalendarEvent} from 'tabler-icons-react';
import Language from 'strings';

const useStyles = createStyles (() => ({
  card: {
    position: 'relative',
    width: '100%',
    maxWidth: 688,
    overflow: 'hidden',
    borderRadius: 24,
    border: '1px solid var(--line)',
    background: 'var(--surface)',
    boxShadow: 'var(--shadow)',
  },
  head: {
    padding: '22px 20px 20px',
    textAlign: 'center',
    color: '#fff',
    backgroundColor: 'var(--emerald-800)',
    backgroundImage: 'var(--pattern), linear-gradient(135deg, var(--emerald-600), var(--emerald-900))',
  },
  icon: {margin: '0 auto 10px', backgroundColor: 'rgba(255,255,255,0.14)', color: 'var(--gold-200)'},
  title: {fontSize: '1.35rem', fontWeight: 800, lineHeight: 1.3, overflowWrap: 'anywhere'},
  description: {marginTop: 8, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, overflowWrap: 'anywhere'},
  adminRow: {display: 'flex', justifyContent: 'space-between', marginBottom: 12},
  body: {padding: '18px 20px 20px'},
  percent: {fontSize: '1.6rem', fontWeight: 800, color: 'var(--emerald-700)', lineHeight: 1},
  partButton: {
    cursor: 'pointer',
    border: 0,
    minHeight: 34,
    transition: 'transform 0.12s ease',
    '&:active': {transform: 'scale(0.96)'},
  },
  completed: {
    marginTop: 14,
    padding: '10px 14px',
    borderRadius: 14,
    background: 'var(--gold-100)',
    border: '1px solid var(--gold-200)',
    color: 'var(--gold-600)',
    fontWeight: 800,
    textAlign: 'center',
  },
}));

const badgeStyles = {inner: {textTransform: 'none', fontWeight: 800}};

// "Duaya 5 gün kaldı" / "Duası bugün" / "Duası yapıldı"
const duaText = duaDate => {
  if (!duaDate) return null;
  const [y, m, d] = String (duaDate).split ('-').map (Number);
  if (!y || !m || !d) return null;
  const today = new Date ();
  today.setHours (0, 0, 0, 0);
  const days = Math.round ((new Date (y, m - 1, d) - today) / 86400000);
  const dua = Language['/cuz'].CuzlerHatimCard.dua;
  if (days > 0) return `${dua[0]} ${days} ${dua[1]}`;
  if (days === 0) return dua[3];
  return dua[2];
};

const lines = text => String (text).split ('\n').map ((line, i) => <p key={i}>{line}</p>);

/**
 * Hatim sayfalarının üstündeki kart: başlık, açıklama, ilerleme, dua günü, kişinin aldıkları.
 * Hatmi oluşturan kişi için sil / değiştir butonları.
 */
const KhatmCard = ({title, description, taken, total, duaDate, badges = [], myParts = [], isAdmin, onDelete, onEdit,
                    takenLabel, leftLabel, mineLabel}) => {
  const {classes} = useStyles ();
  const progress = total > 0 ? (taken / total) * 100 : 0;
  const dua = duaText (duaDate);
  const left = Math.max (total - taken, 0);

  return (
    <Paper className={classes.card}>
      <div className={classes.head}>
        {isAdmin && (onDelete || onEdit) &&
          <div className={classes.adminRow}>
            {onDelete
              ? <Button color="red" variant="white" leftIcon={<Trash size={16} />} radius="xl" size="xs" id="deleteHatim" onClick={onDelete}>
                  {Language['/cuz'].CuzlerHatimCard.deleteHatim}
                </Button>
              : <span />}
            {onEdit &&
              <Button variant="white" leftIcon={<Pencil size={16} />} radius="xl" size="xs" id="editHatim" onClick={onEdit}>
                {Language['/cuz'].CuzlerHatimCard.changeHatim}
              </Button>}
          </div>}

        <ThemeIcon className={classes.icon} size={52} radius={52}>
          <Book size={28} />
        </ThemeIcon>
        <div className={classes.title}>{lines (title || '')}</div>
        {description && <div className={classes.description}>{lines (description)}</div>}
      </div>

      <div className={classes.body}>
        <Group position="apart" align="flex-end">
          <Text size="sm" weight={700} color="dimmed">{takenLabel || Language['/cuz'].CuzlerHatimCard.takenParts}</Text>
          <span className={classes.percent}>%{Math.round (progress)}</span>
        </Group>

        <Progress value={progress} mt={10} size={12} radius="xl" color="emerald" />

        <Group position="apart" mt="md" spacing="xs">
          <Badge size="lg" radius="xl" color="emerald" variant="light" styles={badgeStyles}>
            {leftLabel ? leftLabel (left) : `${left} ${Language['/cuz'].CuzlerHatimCard.leftParts}`}
          </Badge>
          {dua && <Badge size="lg" radius="xl" color="gold" variant="light" styles={badgeStyles}>{dua}</Badge>}
          {badges.map (badge => (
            <Badge key={badge} size="lg" radius="xl" color="gold" variant="light" styles={badgeStyles}>{badge}</Badge>
          ))}
        </Group>

        {myParts.length > 0 && <>
          <Text mt="lg" size="sm" weight={700} color="dimmed">{mineLabel || Language['/cuz'].CuzlerHatimCard.yourParts}</Text>
          <Group mt="xs" spacing={6}>
            {myParts.map (part => {
              // part: "5. cüz" ya da {label, onClick} (dokununca çizelgesi açılır)
              const {label, onClick} = typeof part === 'string' ? {label: part} : part;
              return onClick
                ? <Badge key={label} component="button" type="button" className={classes.partButton} onClick={onClick}
                         size="lg" radius="xl" color="gold" variant="filled" styles={badgeStyles}
                         leftSection={<CalendarEvent size={14} style={{display: 'block'}} />}>{label}</Badge>
                : <Badge key={label} size="lg" radius="xl" color="gold" variant="filled" styles={badgeStyles}>{label}</Badge>;
            })}
          </Group>
        </>}

        {total > 0 && left <= 0 && <div className={classes.completed}>{Language.CuzGrid.Completed}</div>}
      </div>
    </Paper>
  );
};

export default KhatmCard;
