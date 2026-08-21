/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SlideLayout = 
  | 'title' 
  | 'peri-urban'
  | 'three-grounds'
  | 'we-gave-them-names'
  | 'one-grid'
  | 'one-grid-one-line'
  | 'one-grid-two-readings'
  | 'problem' 
  | 'literature' 
  | 'method' 
  | 'the-engine'
  | 'thermal-margin'
  | 'who-carries-heat'
  | 'six-readings'
  | 'four-kilometres'
  | 'grid-wide-dashboard'
  | 'synthesis'
  | 'ecology' 
  | 'ecology-map' 
  | 'stone-fire-trade'
  | 'finding' 
  | 'validation' 
  | 'design' 
  | 'case-study' 
  | 'performance'
  | 'discussion'
  | 'conclusion'
  | 'close';

export interface SlideData {
  id: number; // 1-indexed, up to 13
  kicker: string;
  title: string;
  subtitle?: string;
  layout: SlideLayout;
  bodyText: string[];
  notes: string; // Presenter notes shown in notes panel
  metric?: {
    value: string;
    label: string;
    caption?: string;
  };
}
